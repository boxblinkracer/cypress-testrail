.PHONY: help
.DEFAULT_GOAL := help


help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# ---------------------------------------------------------------------------------------------

install: ## Installs all dependencies
	npm install

clean: ## Clean all dependencies
	rm -rf node_modules

# ---------------------------------------------------------------------------------------------

open-ui: ## Opens Cypress UI
	./node_modules/.bin/cypress open

run: ## Runs all E2E tests
	./node_modules/.bin/cypress run --headless
