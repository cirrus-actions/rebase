# GitHub action to automatically rebase PRs

[![Build Status](https://api.cirrus-ci.com/github/cirrus-actions/rebase.svg)](https://cirrus-ci.com/github/cirrus-actions/rebase) [![](https://images.microbadger.com/badges/version/cirrusactions/rebase.svg)](https://microbadger.com/images/cirrusactions/rebase) [![](https://images.microbadger.com/badges/image/cirrusactions/rebase.svg)](https://microbadger.com/images/cirrusactions/rebase)

After installation simply comment `/rebase` to trigger the action:

![rebase-action](https://user-images.githubusercontent.com/989066/51547853-14a57b00-1e35-11e9-841d-33114f0f0bd5.gif)

# Installation

To configure the action simply add the following lines to your `.github/workflows/rebase.yml` workflow file:

```yaml
name: Automatic Rebase
on:
  issue_comment:
    types: [created]
jobs:
  rebase:
    name: Rebase
    runs-on: ubuntu-latest
    if: >-
      github.event.issue.pull_request != '' && 
      (
        contains(github.event.comment.body, '/rebase') || 
        contains(github.event.comment.body, '/autosquash')
      )
    steps:
      - name: Checkout the latest code
        uses: actions/checkout@v3
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          fetch-depth: 0 # otherwise, you will fail to push refs to dest repo
      - name: Automatic Rebase
        uses: cirrus-actions/rebase@1.8
        with:
          autosquash: ${{ contains(github.event.comment.body, '/autosquash') || contains(github.event.comment.body, '/rebase-autosquash') }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

> NOTE: To ensure GitHub Actions is automatically re-run after a successful rebase action use a [Personal Access Token](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token) for `actions/checkout@v2` and `cirrus-actions/rebase@1.4`. See the following [discussion](https://github.community/t/triggering-a-new-workflow-from-another-workflow/16250/37) for more details.

Example

```yaml

... 
    - name: Checkout the latest code
      uses: actions/checkout@v3
      with:
        token: ${{ secrets.PAT_TOKEN }}
        fetch-depth: 0 # otherwise, you will fail to push refs to dest repo
    - name: Automatic Rebase
      uses: cirrus-actions/rebase@1.8
      env:
        GITHUB_TOKEN: ${{ secrets.PAT_TOKEN }}
```

You can also optionally specify the PR number of the branch to rebase,
if the action you're running doesn't directly refer to a specific
pull request:

```yaml
    - name: Automatic Rebase
      uses: cirrus-actions/rebase@1.8
      env:
        GITHUB_TOKEN: ${{ secrets.PAT_TOKEN }}
        PR_NUMBER: 1245
```


## Restricting who can call the action

It's possible to use `author_association` field of a comment to restrict who can call the action and skip the rebase for others. Simply add the following expression to the `if` statement in your workflow file: `github.event.comment.author_association == 'MEMBER'`. See [documentation](https://developer.github.com/v4/enum/commentauthorassociation/) for a list of all available values of `author_association`.

GitHub can also optionally dismiss an existing review automatically after rebase, so you'll need to re-approve again which will trigger the test workflow.
Set it up in your repository *Settings* > *Branches* > *Branch protection rules* > *Require pull request reviews before merging* > *Dismiss stale pull request approvals when new commits are pushed*.
