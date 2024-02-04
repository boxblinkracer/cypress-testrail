Feature: Login on website

  Background:
    Given I am on the blog page

  Rule: Happy Path

    @smoke
    Scenario Outline: C6872: Filter blog posts by tags
      When I click on tag <tag>
      Then I see tag <title> as title

      Examples:
        | tag    | title  |
        | DEV    | Dev    |
        | DEVOPS | devops |


