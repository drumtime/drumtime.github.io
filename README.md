## requirements

Uses node

    brew install node

then run

    npm install

in the project dir to install dependencies. Finally, you'll need to install [Grunt](http://gruntjs.com) globally

    npm install -g grunt-cli

## development

Just runt

    grunt

which should start the dev server on port 8000. It will compile and watch all assets. Only files in `src` need to be touched, the rest is generated.


## deployment

Run

    grunt build

then commit changes to git and push
