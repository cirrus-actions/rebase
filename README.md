# GitHub action to automatically rebase PRs

[![Build Status](https://api.cirrus-ci.com/github/cirrus-actions/rebase.svg)](https://cirrus-ci.com/github/cirrus-actions/rebase) [![](https://images.microbadger.com/badges/version/cirrusactions/rebase.svg)](https://microbadger.com/images/cirrusactions/rebase) [![](https://images.microbadger.com/badges/image/cirrusactions/rebase.svg)](https://microbadger.com/images/cirrusactions/rebase)

After installation simply comment `/rebase` to trigger the action:

![rebase-action](https://user-images.githubusercontent.com/989066/51547853-14a57b00-1e35-11e9-841d-33114f0f0bd5.gif)

# Installation

To configure the action simply add the following lines to your `.github/workflows/rebase.yml` workflow file:

```yaml
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
    - name: Checkout the latest code
      uses: actions/checkout@v2
      with:
        fetch-depth: 0 # otherwise, you will failed to push refs to dest repo,
        persist-credentials: false # otherwise, the token used is the GITHUB_TOKEN, instead of your personal token.
    - name: Automatic Rebase
      uses: cirrus-actions/rebase@1.4
      env:
        GITHUB_TOKEN: ${{ secrets.PAT_TOKEN }}
```

## Restricting who can call the action

It's possible to use `author_association` field of a comment to restrict who can call the action and skip the rebase for others. Simply add the following expression to the `if` statement in your workflow file: `github.event.comment.author_association == 'MEMBER'`. See [documentation](https://developer.github.com/v4/enum/commentauthorassociation/) for a list of all available values of `author_association`.

GitHub can also optionally dismiss an existing review automatically after rebase, so you'll need to re-approve again which will trigger the test workflow.
Set it up in your repository *Settings* > *Branches* > *Branch protection rules* > *Require pull request reviews before merging* > *Dismiss stale pull request approvals when new commits are pushed*.

