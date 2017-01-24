import React, {Component} from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {browserHistory} from 'react-router';
import {List} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import {Card, CardActions, CardTitle} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';

import {get, httDelete} from '../services/Requests';
import {modelURL} from '../services/urlFactory';


// import { getBlogById } from '../services/BlogService';

/**
 * Representing the logic of presenting existing posts belogs to the blog
 */
class BlogPage extends Component {

/**
 * Navigates to the relevent post of the selected blog
 * @param  {Integer} blogId The blog ID
 * @param  {Integer} postId The post ID
 */
  static onPostClick(blogId, postId) {
    browserHistory.push(`/blogs/${blogId}/posts/${postId}`);
  }
/**
* Navigates to the new post of the selcted blog
* @param {Integer} blogId The blog ID
*/
  static addNewPost(blogId) {
    browserHistory.push(`/blogs/${blogId}/posts/new`);
  }
/**
* Class constructor
* @param {Object} props User define component
*/
  constructor(props) {
    super(props);
    this.state = {
      // blog: getBlogById(parseInt(props.params.blogId))
      // blog: existingBlog,
      dataLoading: true,
      blog: {},
    };

    this.fetchBlog = this.fetchBlog.bind(this);

    this.fetchBlog(this.props.params.blogId);
  }
/**
* Fetches a blog
* @param  {Integer} blogId The blogId
* @return {Event}          Sends a GET request
*/
  fetchBlog(blogId) {
    const url = modelURL('blog', blogId);

    return get(url)
      .then((response) => {
        this.setState({
          dataLoading: false,
          blog: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          dataLoading: true,
          blog: {},
        });
      });
  }
/**
 * Delets a selected post
 */
  onDeleteBlog() {
    console.log(this.state.blog.id);
    const blogId = this.state.blog.id;

    const url = modelURL('blog', blogId);
    httDelete(url)
      .then((response) => {
        this.setState({
          post: {},
          dataLoading: true,
        });
        browserHistory.push('blog');
        // refresh
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          blog: {},
          dataLoading: false,
        });
      });
  }
/**
 * [fetchData description]
 * @return {[type]} [description]
 */
  // fetchData(url, params) {
  //   return get(url, params)
  //     .then((response) => {
  //       console.log(response.data);
  //       this.setState({
  //         blog: response.data.results,
  //       });
  //       return response.data;
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       // TODO: Display error message
  //     });
  // }

/**
* Describes the elements on the Blog page
* @return {String} HTML elements
*/
  render() {
    const blog = this.state.blog;
    const addNewPost = BlogPage.addNewPost.bind(this, blog.id);
    const onDeleteBlog = this.onDeleteBlog.bind(this);
    let posts = [];

    if(blog.Posts && blog.Posts.length) {
      posts = blog.Posts.map((post) => {
        const onPostClick = BlogPage.onPostClick.bind(this, blog.id, post.id);

        return (
          <div>
              <Card key={`${blog.id}-${post.id}`}>
                <CardTitle title={post.id} subtitle={post.content} />
                <CardActions>
                  <RaisedButton label="Leave a comment" onClick={onPostClick} />
                </CardActions>
              </Card>
            </div>
        );
      });
    }

    // return (
    //   <div>
    //     {this.state.blog.name}
    //     <div>{this.state.blog.author}</div>
    //       <FloatingActionButton onClick={addNewPost}>
    //   <ContentAdd />
    // </FloatingActionButton>
    //     {posts}
    //   </div>
    // );
    //
    return (
      <div>
        <List>
          <Subheader>Postes</Subheader>
          <RaisedButton label="Delete Posts" primary onClick={onDeleteBlog}/>
          {posts}
        </List>
        <FloatingActionButton onClick={addNewPost}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}

BlogPage.propTypes = {
  params: React.PropTypes.object.isRequired,
};

export default BlogPage;
