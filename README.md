# GitHub action to automatically rebase PRs

[![Build Status](https://api.cirrus-ci.com/github/cirrus-actions/rebase.svg)](https://cirrus-ci.com/github/cirrus-actions/rebase) [![](https://images.microbadger.com/badges/version/cirrusactions/rebase.svg)](https://microbadger.com/images/cirrusactions/rebase) [![](https://images.microbadger.com/badges/image/cirrusactions/rebase.svg)](https://microbadger.com/images/cirrusactions/rebase)

After installation simply comment `/rebase` to trigger the action:

![rebase-action](https://user-images.githubusercontent.com/989066/51547853-14a57b00-1e35-11e9-841d-33114f0f0bd5.gif)

# Installation

To configure the action simply add the following lines to your `.github/workflows/rebase.yml` workflow file:

```yml
on: issue_comment
types: [created]
name: Automatic Rebase
jobs:
  rebase:
    name: Rebase
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    - name: Automatic Rebase
      uses: cirrus-actions/rebase@master
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
