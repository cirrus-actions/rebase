# GitHub action to automatically rebase PRs

[![Build Status](https://api.cirrus-ci.com/github/cirrus-actions/rebase.svg)](https://cirrus-ci.com/github/cirrus-actions/rebase) [![](https://images.microbadger.com/badges/version/cirrusactions/rebase.svg)](https://microbadger.com/images/cirrusactions/rebase) [![](https://images.microbadger.com/badges/image/cirrusactions/rebase.svg)](https://microbadger.com/images/cirrusactions/rebase)

After installation simply comment `/rebase` to trigger the action:

![rebase-action](https://user-images.githubusercontent.com/989066/51547853-14a57b00-1e35-11e9-841d-33114f0f0bd5.gif)

# Installation

To configure the action simply add the following lines to your `.github/workflows/rebase.yml` workflow file:

```yml
on: 
  issue_comment:
    types: [created]
name: Automatic Rebase
jobs:
  rebase:
    name: Rebase
    if: github.event.issue.pull_request != '' && contains(github.event.comment.body, '/rebase')
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    - name: Automatic Rebase
      uses: cirrus-actions/rebase@1.2
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  # https://github.community/t5/GitHub-Actions/Workflow-is-failing-if-no-job-can-be-ran-due-to-condition/m-p/38186#M3250
  always_job:
    name: Aways run job
    runs-on: ubuntu-latest
    steps:
      - name: Always run
        run: echo "This job is used to prevent the workflow to fail when all other jobs are skipped."
```
