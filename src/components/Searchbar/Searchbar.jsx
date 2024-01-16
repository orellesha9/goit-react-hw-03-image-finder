import { Component } from 'react';
import styles from './searchbar.module.css';
import { getAllPosts } from 'api/post';
import PostSearchForm from './PostSearchForm/PostSearchForm';
import ImageGallery from './ImageGallery/ImageGallery';
import { searchPosts } from 'api/post';
import Button from 'components/Button/Button';
import Modal from 'components/Modal/Modal';

class Searchbar extends Component {
  state = {
    search: '',
    posts: [],
    loading: false,
    error: null,
    page: 1,
    modalOpen: false,
    postDetails: {},
  };

  async componentDidUpdate(prevProps, prevState) {
    const { search, page } = this.state;
    if (search && (search !== prevState.search || page !== prevState.page)) {
      this.fetchPosts();
    }
  }

  async fetchPosts() {
    const { search, page } = this.state;
    try {
      this.setState({
        loading: true,
      });
      const { data } = await searchPosts(search, page);
      this.setState(({ posts }) => ({
        posts: data.hits?.length ? [...posts, ...data.hits] : posts,
      }));
    } catch (error) {
      this.setState({ error: error.messege });
    } finally {
      this.setState({
        loading: false,
      });
    }
  }

  loadMore = () => {
    this.setState(({ page }) => ({ page: page + 1 }));
  };

  showModal = ({ webformatURL, largeImageURL }) => {
    this.setState({
      modalOpen: true,
      postDetails: { webformatURL, largeImageURL },
    });
  };

  closeModal = () => {
    this.setState ({
        modalOpen:false,
        postDetails:{}
    })
  }

  handleSearch = ({ search }) => {
    this.setState({
      search,
      posts: [],
      page: 1,
    });
  };

  render() {
    const { handleSearch, loadMore, showModal } = this;
    const { posts, loading, error, modalOpen, postDetails } = this.state;

    const isPost = Boolean(posts.length);

    return (
      <>
        <PostSearchForm onSubmit={handleSearch} />
        {error && <p className={styles.error}>{error}</p>}
        {loading && <p>...Loading</p>}
        {isPost && <ImageGallery showModal={showModal} items={posts} />}
        {isPost && (
          <Button onClick={loadMore} type="button">
            Load more
          </Button>
        )}
        {modalOpen && (
          <Modal close={this.closeModal}>
            <img src={postDetails.largeImageURL} />
          </Modal>
        )}
      </>
    );
  }
}

export default Searchbar;