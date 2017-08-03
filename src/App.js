import React, { Component } from 'react';
import './App.css';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            eventsList: [],
            search: '',
            filter: '-1'
        };
    }

    updateSearch(event) {
        this.setState({search: event.target.value.substr(0, 20)});
    }
    updateFilter(event) {
        this.setState({filter: event.target.value});
    }
    componentWillMount(){
        this._fetchEvents();
    }

    render() {
        const events = this._getEvents();
        return(
            <div className="comment-box">
                <div className="searching">
                    <input type="text" value={this.state.search}
                           onChange={this.updateSearch.bind(this)}/>
                    <div className="filtering-dropdowm">
                        <select value={this.state.filter} onChange={this.updateFilter.bind(this)}>
                            <option value='-1'>Select day</option>
                            <option value='0'>Sun</option>
                            <option value='1'>Mon</option>
                            <option value='2'>Tue</option>
                            <option value='3'>Wed</option>
                            <option value='4'>Thu</option>
                            <option value='5'>Fri</option>
                            <option value='6'>Sat</option>
                        </select>
                    </div>
                </div>
                <h1>Upcoming events</h1>
                <h4 className="events-count">{this._getEventsTitle(events.length)}</h4>
                <div className="events-list">
                    {events.map(event =>  <Event {...event} />)}
                </div>
            </div>
        );
    }
    _getEvents() {
        let filteredEvents;

        filteredEvents = this.state.eventsList.filter(
                (event) => {
                    return event.subject.toLowerCase().indexOf(
                        this.state.search.toLowerCase()) !== -1 || event.author.toLowerCase().indexOf(
                        this.state.search.toLowerCase()) !== -1;
                }
            );

        if( this.state.filter !== '-1' ){
            filteredEvents = filteredEvents.filter(
                (event) => {
                    return event.date.getDay().toString() === this.state.filter.toString();
                }
            )
        }
        return filteredEvents;
    }

    _getEventsTitle(eventsCount){
        if (eventsCount === 0){
            return 'No events';
        }
        else if (eventsCount === 1) {
            return '1 event';
        }
        else {
            return `${eventsCount} events`;
        }
    };

    _fetchEvents() {
        fetch('http://boiling-tor-31289.herokuapp.com/users/me/polls')
        .then(response => response.json())
        .then(data => {
            const eventsList = data.map((event, idx) => ({
                key: idx,
                subject: event.title,
                author: (event.initiator && event.initiator.name) || '',
                date: new Date(event.initiated),
                participants: event.participants.length
            }));
            console.log(eventsList);
            this.setState({eventsList});
        });
    }
}

class Event extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            showComments: false
        };
    }
    render() {
        const comments = this._getComments();
        let commentNodes;
        if (this.state.showComments) {
            commentNodes = <div className="comment-list"> {comments} </div>;
        }
        return(
            <div className="event">
                <p className="event-header">{this.props.subject}</p>
                <div className="event-author-date">
                    <p className="event-body">
                        by {this.props.author}
                    </p>
                    <p className="event-creation-date">
                        {this.props.date.toDateString()}
                    </p>
                </div>

                <div className="event-footer">
                    <div className="comment-section">
                        <a href="#" onClick={this._handleClick.bind(this)}> {this._getCommentsNumber(comments.length)} </a>
                        {commentNodes}
                    </div>
                    <div className="participants-list">
                        <a href="#"> {this.props.participants.toString()} participants </a>
                    </div>
                </div>
            </div>
        );
    }
    _getComments(){
        const commentsList = [
            {id:1, author:'Josh Cohen', body:'I will late'},
            {id:2, author:'Venesa Doe', body:'Yay!'}
        ];

        return commentsList.map((comment) => {
            return <Comment
                author={comment.author} body={comment.body} key={comment.id}/>
        })
    }

    _getCommentsNumber(numberOfComments){
        return `${numberOfComments} comments`;
    }

    _handleClick() {
        this.setState({
            showComments: !this.state.showComments
        });
    }
}

class Comment extends React.Component {
    render() {
        return (
            <div className="comment-list">
                <h5 className="comment-author">{this.props.author}</h5>
                <p className="comment-body">{this.props.body}</p>
            </div>
        )
    }
}

export default App;
