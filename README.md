# utils

[![Continuos integration](https://api.travis-ci.org/IBMResearch/utils.svg)](https://travis-ci.org/IBMResearch/utils)

Some common utils we use in our projects: Lodash, Bluebird, Bluemix logging/error reporting, debug ...


## Install

We're not pushing it to npm because it's

```sh
npm i --save IBMResearch/utils
```


## Developer guide

- Use [GitHub pull requests](https://help.github.com/articles/using-pull-requests).
- We love ES6, so we use [ESLint](http://eslint.org/) and the [Airbnb](https://github.com/airbnb/javascript) style guide. It's the most complete, so it forces the developers to keep a consistent style.
- Please run to be sure your code fits with it and the tests keep passing:
```sh
npm test
```


### Commit messages rules:
- It should be formed by a one-line subject, followed by one line of white space. Followed by one or more descriptive paragraphs, each separated by one￼￼￼￼ line of white space. All of them finished by a dot.
- If it fixes an issue, it should include a reference to the issue ID in the first line of the commit.
- It should provide enough information for a reviewer to understand the changes and their relation to the rest of the code.
