# Contributing
Thanks for choosing to contribute to Discord Bot Creator. 🎉

#### Table of Contents

[Requirements](#requirements)
  * [Template Files](#template-files)
  * [Renderer](#renderer)
  * [Main](#main)

[Guidelines](#guidelines)
[How to Contribute](#how-to-contribute)
  * [Create Issues](#create-issues)
  * [Create Pull Request](#create-pull-request)

[Styleguide](#styleguide)
  * [Git Commit Messages](#git-commit-messages)

[Structure](#structure)
  

## Requirements
There are multiple sections in the project that require different knowledge. You don't need to know all the technologies in the project to contribute. Feel free to read through any of the subfields to find the perfect use of your skills here.

### Template Files
To edit template files, which will be copied to a user-chosen folder later an understanding of discord.js@13 is needed.
You will need to look into the different classes from ``/resources/bot`` to understand what the separate files in ``/resources/bot/actions`` are doing.

### Renderer
The renderer folder contains all Next.js components and frontend logic.
To contribute here you'd have to know Next.js or React and a little bit about electron.

### Main
The main folder contains all Electron logic.
It's important that the code here works in production and works on Windows, Linux and MacOS

## Guidelines
We are working on the project together, and it's important that we all have fun doing it.
By contributing you vote for open source software and for a better, more efficient way of creating bots.
Anything that is against the Discord TOS and the GitHub TOS is bad and is not tolerated.

Please make sure that your code is readable and efficient.

## How to Contribute

### Create Issues
There are many issues with the project so to speak. It would be really nice if you could help put them into issues for everyone else. Not sure what helps the project more, a good pull request or a good issue. 😄

### Create Pull Requests
You're interested in coding? Good choice! There are a few things that you'd need to pay attention though. It'd be great to only change the things that need to be changed to fix the targeted problem. Additionally it'd be cool if you could do a commit for every significant change you make.

## Styleguides

### Git Commit Messages
*(Copied from "[Git Commit Messages](https://github.com/atom/atom/blob/master/CONTRIBUTING.md#git-commit-messages)")*

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* When only changing documentation, include `[ci skip]` in the commit title
* Consider starting the commit message with an applicable emoji:
    * :art: `:art:` when improving the format/structure of the code
    * :racehorse: `:racehorse:` when improving performance
    * :non-potable_water: `:non-potable_water:` when plugging memory leaks
    * :memo: `:memo:` when writing docs
    * :penguin: `:penguin:` when fixing something on Linux
    * :apple: `:apple:` when fixing something on macOS
    * :checkered_flag: `:checkered_flag:` when fixing something on Windows
    * :bug: `:bug:` when fixing a bug
    * :fire: `:fire:` when removing code or files
    * :green_heart: `:green_heart:` when fixing the CI build
    * :white_check_mark: `:white_check_mark:` when adding tests
    * :lock: `:lock:` when dealing with security
    * :arrow_up: `:arrow_up:` when upgrading dependencies
    * :arrow_down: `:arrow_down:` when downgrading dependencies
    * :shirt: `:shirt:` when removing linter warnings

## Structure
![Code Structure](https://user-images.githubusercontent.com/30301026/136775115-22fe1842-b56d-434d-8639-46eecc51d014.jpg)
