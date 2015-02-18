contentscript/style.css: contentscript/style.less
	lessc $^ $@

clean:
	rm contentscript/style.css
