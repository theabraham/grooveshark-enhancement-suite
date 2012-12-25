function bufferClosure() {

    console.log('--> buffer loaded');

    function Buffer(uid) {
        this.uid = '#' + uid;
        this.tag = '<textarea id="' + uid + '" style="display:none;"></textarea>';
        this.$buffer = $(this.uid);
    }

    Buffer.prototype.fetchBuffer = function() {
        if (this.$buffer.length === 0) {
            $('body').append($(this.tag));
        }

        this.$buffer = $(this.uid);
    }

    Buffer.prototype.getValue = function() {
        this.fetchBuffer();
        var value = this.$buffer.text();
        return value === '' ? ''
                            : JSON.parse(value);
    }

    Buffer.prototype.setValue = function(value) {
        this.fetchBuffer();
        this.$buffer.text(JSON.stringify(value));
    }

    Buffer.prototype.clear = function() {
        this.fetchBuffer();
        this.$buffer.text('');
    }

    window.Buffer = Buffer;

}

