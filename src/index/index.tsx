import React from 'react';
import './style.css';

let weekName: any = ['日', '一', '二', '三', '四', '五', '六'];

// 获取当前日期  默认：yy-mm-dd HH:MM:SS
let getCurrentDate: Function = (sign: any) => {
    let str: String = "";
    var date_ = new Date();
    var year: any = date_.getFullYear();
    var month: any = date_.getMonth() + 1;
    var day: any = date_.getDate();
    var week: any = date_.getDay();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var hours: any = date_.getHours();
    var mins: any = date_.getMinutes();
    var secs: any = date_.getSeconds();
    var msecs: any = date_.getMilliseconds();
    if (hours < 10) hours = "0" + hours;
    if (mins < 10) mins = "0" + mins;
    if (secs < 10) secs = "0" + secs;
    if (msecs < 10) secs = "0" + msecs;
    str = year + "-" + month + "-" + day + " " + hours + ":" + mins + ":" + secs + ` 周${weekName[week]}  `;
    if (sign == "yy-mm-dd") {
        str = year + "-" + month + "-" + day;
    }
    return str;
}

class Index extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            notes: [],
            nowItem: {
                title: "",
                body: "",
                updated: "",
                id: "",
            },
        }

    }

    componentWillMount() {
        this.init();
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    init() {
        let notes = [];
        try {
            notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");
        } catch (error) {
            // 
        }
        this.setState({ notes });
    }

    addNotes() {
        let { notes } = this.state;
        let note = {
            title: "新建笔记",
            body: "开始记录... ",
            // updated: new Date().toISOString(),
            updated: getCurrentDate(),
            id: Math.floor(Math.random() * 1000000),
        }
        notes.push(note);
        this.setState({ notes });
        localStorage.setItem("notesapp-notes", JSON.stringify(notes));
    }

    checkItem(item: any) {
        let nowItem: any = JSON.parse(JSON.stringify(item));
        this.setState({ nowItem });
    }


    // 输入框内容修改
    handleChange(sign: String, e: any) {
        let { nowItem } = this.state;
        let value = e.target.value;
        if (sign == "title") {
            nowItem.title = value;
        }
        if (sign == "body") {
            nowItem.body = value;
        }
        this.setState({ nowItem })
    }


    // 保存
    saveFN() {
        let { notes, nowItem } = this.state;
        for (let x of notes) {
            if (nowItem.id == x.id) {
                x.title = nowItem.title;
                x.body = nowItem.body;
                // x.updated = new Date().toISOString();
                x.updated = getCurrentDate();
            }
        }
        this.setState({ notes });
        localStorage.setItem("notesapp-notes", JSON.stringify(notes));

    }

    //删除
    delFN(item: any, index: Number) {
        let { notes, nowItem } = this.state;

        if (confirm("真的要删除吗?")) {
            notes.splice(index, 1);
            this.setState({ notes });
            localStorage.setItem("notesapp-notes", JSON.stringify(notes));

            if (nowItem.id == item.id) {
                nowItem = {
                    title: "",
                    body: "",
                    updated: "",
                    id: "",
                }
                this.setState({ nowItem });
            }
        } else {
            // 
        }
    }

    render() {
        let { notes, nowItem } = this.state;

        return (
            <div className="page-index">
                <div className="page-left">
                    <div className="notes__sidebar">
                        <button className="notes__add" type="button" onClick={this.addNotes.bind(this)}>添加新的笔记 📒</button>
                        <div className="notes__list"></div>
                    </div>

                    <div className="nav">
                        {
                            notes.map((item: any, index: Number) => {
                                return (
                                    <div className={nowItem.id == item.id && "notes__list-item notes__list-item--selected" || "notes__list-item"} key={item.id} onClick={this.checkItem.bind(this, item, index)}>
                                        <div className="notes__small-title">{item.title}</div>
                                        <div className="notes__small-body">{item.body}</div>
                                        <div className="notes__small-updated">{item.updated}</div>
                                        <div className="btn-del" onClick={(e) => e.stopPropagation()}>
                                            <div className="btn" onClick={this.delFN.bind(this, item, index)}><span>删除</span></div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                <div className="page-right">
                    <div className={nowItem.id && "txt-box" || "el-hide"}>
                        <input className="notes__title" type="text" value={nowItem.title} onChange={this.handleChange.bind(this, 'title')} />
                        <textarea className="notes__body" rows={20} cols={30} value={nowItem.body} onChange={this.handleChange.bind(this, 'body')} />
                    </div>
                    <div className={nowItem.id && "btn" || "el-hide"} onClick={this.saveFN.bind(this)}><span>保存</span></div>
                </div>

            </div>
        )
    }
}

export default Index;
