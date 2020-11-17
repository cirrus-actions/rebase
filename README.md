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
    - name: Checkout the latest code
      uses: actions/checkout@v2
      with:
        fetch-depth: 0
    - name: Automatic Rebase
      uses: cirrus-actions/rebase@1.4
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Restricting who can call the action

It's possible to use `author_association` field of a comment to restrict who can call the action and skip the rebase for others. Simply add the following expression to the `if` statement in your workflow file: `github.event.comment.author_association == 'MEMBER'`. See [documentation](https://developer.github.com/v4/enum/commentauthorassociation/) for a list of all available values of `author_association`.

# Running multiple GitHub Actions workflows

If you have another workflow setup that for example executes unit tests, and that workflow is a required status check that needs to pass before merging, you may find the check in "waiting" status after `/rebase`. Unfortunately, that's a current Actions limitation, see [this community post](https://github.community/t/triggering-a-new-workflow-from-another-workflow/16250/33) and/or [#65](https://github.com/cirrus-actions/rebase/issues/65) for more details.

However, one possible workaround is to setup your test workflow to run also on [pull request review events](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows#pull_request_review) like:
```
on: [push, pull_request_review]
```
Then for example approving a code review will start, run and finish the test workflow and you'll be able to merge the pull request (if the check passes).

GitHub can also optionally dismiss an existing review automatically after rebase, so you'll need to re-approve again which will trigger the test workflow.
Set it up in your repository *Settings* > *Branches* > *Branch protection rules* > *Require pull request reviews before merging* > *Dismiss stale pull request approvals when new commits are pushed*.

