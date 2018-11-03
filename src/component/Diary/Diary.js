import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import SpecificDiaryList from './SpecificDiaryList';
import { Button } from 'reactstrap';
import BubbleList from './BubbleList';
// import { resolveComponents } from 'uri-js';
import NewArticle from './newarticle';
import api from '../../api/api';

class Diary extends Component {
  state = {
    data: [],
    hashtag: [],
    selectedTag: null,
    isClicked: false,
  };

  _hashTableUpdate = () => {
    api.getData('tag', 'hashtag', (res, state) => {
      this.setState({
        [state]: res.data,
      });
    });
  };

  _onClick = tag => {
    console.log(tag);
    api.getData(tag, 'data', (res, state) => {
      this.setState({
        [state]: res.data,
        selectedTag: tag,
      });
    });
  };

  _toggle = () => {
    this.setState({
      isClicked: !this.state.isClicked,
    });
  };

  _postDataUpdate = postingData => {
    const { data } = this.state;

    // 우선 태그와 상관없이 띄우는건 만들었지만, 현재 클릭한 tag를 판단하여 data를 업데이트 해야하는지
    // 고민해봐야 할듯..
    this.setState({
      data: data.concat(postingData),
    });

    this._hashTableUpdate();
  };

  componentDidMount() {
    this._hashTableUpdate();
  }

  render() {
    return (
      <div>
        {!this.state.hashtag ? (
          <p> loading... </p>
        ) : (
          <span>
            <Button className="newbtn" onClick={this._toggle}>
              새글쓰기
            </Button>
            {this.state.isClicked ? (
              <NewArticle
                toToggle={this._toggle}
                postUpdate={this._postDataUpdate}
                hashTableUpdate={this._hashTableUpdate}
              />
            ) : null}
            <BubbleList tags={this.state.hashtag} clickFunc={this._onClick} />
            {this.state.data ? (
              <SpecificDiaryList
                articles={this.state.data}
                tag={this.state.selectedTag}
                clickFunc={this._onClick}
                hashTableUpdate={this._hashTableUpdate}
              />
            ) : null}
          </span>
        )}
      </div>
    );
  }
}

Diary.propTypes = {};

export default Diary;
