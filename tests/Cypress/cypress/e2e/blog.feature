Feature: Login on website

  Background:
    Given I am on the blog page

  Rule: Happy Path

    @smoke
    Scenario Outline: Filter blog posts by tags
      When I click on tag <tag>
      Then I see the tag <title> as title

      Examples:
        | tag    | title  |
        | DEV    | Dev    |
        | DEVOPS | devops |


  Rule: Edge Cases

    Scenario: Filter for invalid tag
      When I enter tag "abc" in the URL
      Then I must not see the blog
