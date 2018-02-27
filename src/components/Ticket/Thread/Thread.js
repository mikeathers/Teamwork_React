import React from "react";
import moment from "moment";
import "es6-shim";

import "./Thread.css";

// Thread component
// Will render a small component if the thread type is 'eventInfo' 
// or renders a big component if there is corrospondance from a user, thread type equalling 'message' or 'task'.

// Lots of conditional rendering taking place based on whether the component gets clicked. 


export default class Thread extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            clicked: false
        }
    }

    onClick = () => {
        this.setState({ clicked: !this.state.clicked })
    }
    render() {
        const action = this.props.thread.Type === "note" ? "action note" : "action";
        const thread = this.props.thread.Type === "note" ? (this.state.clicked ? "thread-div clicked note-div" : "thread-div note-div") : (this.state.clicked ? "thread-div clicked" : "thread-div");
        return (
            <div className="thread">
                {
                    this.props.thread.Type === "eventInfo" ? (
                        <div className="thread-div-event-info">
                            <div className="thread-event-info">
                                <div>
                                    <p>{this.props.thread.CreatedBy.FirstName}</p> <p>{this.props.thread.CreatedBy.LastName}</p> <p className="thread-body" dangerouslySetInnerHTML={{ __html: this.props.thread.ParsedBody }} />
                                    <p className="pull-right thread-date-event-info">Created {moment(this.props.thread.CreatedAt).format("MMMM Do YYYY")}</p>
                                </div>
                            </div>
                        </div>
                    ) : ( this.props.thread.Type !== "note" ?
                            <div className={thread}>

                                <div onClick={this.onClick} className="thread-title">
                                    <div><img className="avatar" alt="avatar" src={this.props.thread.CreatedBy.AvatarUrl} /></div>
                                    <div className="thread-title-text">
                                        <p className="name">{this.props.thread.CreatedBy.FirstName} {this.props.thread.CreatedBy.LastName}</p> <p className={action}>{this.props.thread.Action}</p>
                                        {!this.state.clicked && <p className="thread-preview">{this.props.thread.Preview}</p>}
                                    </div>
                                    {this.state.clicked && <div className="thread-info">
                                        <div>
                                            {this.props.thread.AgentsNotified !== null && <span><strong>Agents notified: </strong>{this.props.thread.AgentsNotified.map((a) => <p key={a.Id}>{a.FirstName} {a.LastName},&nbsp;</p>)}</span>}
                                            {this.props.thread.NewTicketAssignment !== null && <p><strong>Assinged to: </strong>{this.props.thread.NewTicketAssignment.FirstName} {this.props.thread.NewTicketAssignment.LastName}, &nbsp;</p>}
                                            {this.props.thread.NewTicketStatus !== null ? <p><strong>New Status:</strong> {this.props.thread.NewTicketStatus}</p> : <p className="empty-holder"></p>}
                                        </div>
                                        <div>
                                            {this.props.thread.Cc !== null && <span><strong>CC: </strong>{this.props.thread.Cc.map((c) => <p key={c}>{c}, &nbsp;</p>)}</span>}
                                        </div>
                                        <p className="pull-right thread-date">Created {moment(this.props.thread.CreatedAt).format("MMMM Do YYYY")}</p>
                                    </div>}
                                    <div className="line-break"></div>
                                </div>
                                                        {/* Used to render HTML and not a string with lots of HTML tags.*/}
                                <p className="thread-body" dangerouslySetInnerHTML={{ __html: this.props.thread.Body }} />
                                {this.props.thread.Attachments.length !== null && this.props.thread.Attachments.map((attachment) => <p key={attachment.id}><span className="glyphicon glyphicon-paperclip"/> <a href={`https://speedmedical.eu.teamwork.com/desk/file/${attachment.id}/download`}>{attachment.filename}</a></p>)}
                            </div> : null
                        )
                }

            </div>
        );
    }
}
