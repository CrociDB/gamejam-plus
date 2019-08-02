class Dialog {
    constructor(id) {
        this.dialogElement = document.querySelector("#" + id);
        this.dialogText = document.querySelector("#" + id + " p");
        this.oneblink = null;
        this.twoblink = null;
        this.active = false;
    }

    show(message, oneblink, twoblink) {
        this.dialogElement.classList.remove("hidden");
        this.dialogText.innerHTML = message;
        this.oneblink = oneblink;
        this.twoblink = twoblink;
        this.active = true;
    }

    close(callback) {
        this.dialogElement.classList.add("hidden");
        callback();
    }

    setBlink(blink) {
        if (this.active) {
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