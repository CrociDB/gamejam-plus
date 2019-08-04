class Dialog {
    constructor(id) {
        this.dialogElement = document.querySelector("#" + id);
        this.dialogText = document.querySelector("#" + id + " p");
        this.inputItem = document.querySelector("#" + id + " .input");
        this.oneblink = null;
        this.twoblink = null;
        this.active = false;
        this.finished = false;
    }

    showList(messages, oneblink, twoblink) {
        this.list = messages;
        this.currentInList = 0;

        this.oneblink = oneblink;
        this.twoblink = twoblink;

        console.dir(this.oneblink, this.twoblink);

        this._show(messages[this.currentInList]);
    }

    _show(message) {
        this.dialogElement.classList.remove("hidden");

        this.inputItem.style.opacity = "0.0";
        
        // appearing effect
        let total = message.length;
        let step = Math.ceil(total / 30);
        let that = this;
        co(function*() {
            let c = 0;
            while (c < total) {
                that.dialogText.innerHTML = message.substr(0, c);
                c += step;
                yield .05;
            }
            that.dialogText.innerHTML = message;
            
            let o = 0;
            while (o < 1.0) {
                o += .15;
                that.inputItem.style.opacity = "" + o;
                yield .1;
            }

            that.finished = true;
        });
        
        this.active = true;
    }
    
    show(message, oneblink, twoblink) {
        this.oneblink = oneblink;
        this.twoblink = twoblink;
        this.list = null;
        this.currentInList = -1;
        this._show(message);
    }

    close(callback) {
        this.dialogElement.classList.add("hidden");
        this.active = false;
        callback();
    }

    setBlink(blink) {
        if (this.active && this.finished) {
            if (this.list != null && this.currentInList > -1 && this.currentInList < this.list.length - 1) {
                if (blink > 0)
                {
                    this.currentInList++;
                    this._show(this.list[this.currentInList]);
                }
            } else {
                if (blink == 1) {
                    if (this.oneblink != null) {
                        this.close(this.oneblink);
                    }
                } else if (blink == 2) {
                    if (this.twoblink != null) {
                        this.close(this.twoblink);
                    }   
                }
            }
        }
    }
}