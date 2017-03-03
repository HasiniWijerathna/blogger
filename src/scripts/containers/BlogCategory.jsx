import React, {Component} from 'react';
import {get} from '../services/Requests';
import {modelURL} from '../services/urlFactory';

import {Card, CardActions, CardHeader, CardTitle} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import {browserHistory} from 'react-router';
import Subheader from 'material-ui/Subheader';
import AutoComplete from 'material-ui/AutoComplete';
import Snackbar from 'material-ui/Snackbar';
import {grey700} from 'material-ui/styles/colors';
import LinearProgress from 'material-ui/LinearProgress';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import {List} from 'material-ui/List';
import ContentAdd from 'material-ui/svg-icons/content/add';
/**
* Represents the view logic of  blogs belongs to a one category functionality
*/
class BlogCategory extends Component {
/**
* Navigates to the relevent blog page
* @param  {Integer} blogId Id of the selected blog
*/
  static onBlogClick(blogId) {
    browserHistory.push(`/blogs/${blogId}`);
  }
/**
* Class constructor
* @param {Object} props User define component
*/
  constructor(props) {
    super(props);

    this.state = {
      blogs: [],
      loading: true,
      open: false,
      message: '',
      completed: 5000,
      loading: false,
      category: '',
    };
    this.fetchCategory = this.fetchCategory.bind(this);
  }
/**
 * Called after the component is mounted
 */
  componentDidMount() {
    this.requestData();
  }
/**
 * Request all data from the API
 */
  requestData() {
    this.fetchCategory(this.props.params.categoryId);
  }
/**
 * Fetches all the blogs belongs to a category
 * @param  {Integer} categoryId Selected categoryId
 * @return {Event}              Sends a GET request
 */
  fetchCategory(categoryId) {
    const url = modelURL('blogCategory', categoryId);
    this.setState({
      loading: true,
    });

    return get(url)
     .then((response) => {
       this.setState({
         category: response.data.name,
         blogs: response.data.Blogs,
         loading: false,
       });
     })
     .catch((error) => {
       this.setState({
         blogs: [],
         loading: false,
       });
     });
  }
/**
 * Hides the snack bar
 */
  handleRequestClose() {
    this.setState({
      open: false,
      message: '',
    });
  }
/**
* Navigates to the Add blogs page
*/
  addNewBlog() {
    browserHistory.push('blogs/new');
  }
/**
* Describes the elements on the Add new post page
* @return {String} HTML elements
*/
  render() {
    const blogs = this.state.blogs.map((blog) => {
      const onBlogClick = BlogCategory.onBlogClick.bind(this, blog.id);
      return(
        <div key={blog.id}>
          <Card>
            <CardTitle title={blog.name} />
            <CardActions>
              <RaisedButton label="Click here for posts" onClick={onBlogClick} />
            </CardActions>
          </Card>
        </div>
      );
    });
    return(
      <div>
        <div className= "blogCategory">
          <h4>{this.state.category}</h4>
        </div>
        {blogs}
      </div>
    );
  }
  }
BlogCategory.propTypes = {
  params: React.PropTypes.object,
};

BlogCategory.defaultProps = {
  params: {},
};
export default BlogCategory;