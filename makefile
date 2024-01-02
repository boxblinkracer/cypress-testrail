.PHONY: help
.DEFAULT_GOAL := help


help:
	@echo ""
	@echo "PROJECT COMMANDS"
	@echo "--------------------------------------------------------------------------------------------"
	@printf "\033[33mInstallation:%-30s\033[0m %s\n"
	@grep -E '^[a-zA-Z_-]+:.*?##1 .*$$' $(firstword $(MAKEFILE_LIST)) | awk 'BEGIN {FS = ":.*?##1 "}; {printf "\033[33m  - %-30s\033[0m %s\n", $$1, $$2}'
	@echo "--------------------------------------------------------------------------------------------"
	@printf "\033[36mDevelopment:%-30s\033[0m %s\n"
	@grep -E '^[a-zA-Z_-]+:.*?##2 .*$$' $(firstword $(MAKEFILE_LIST)) | awk 'BEGIN {FS = ":.*?##2 "}; {printf "\033[36m  - %-30s\033[0m %s\n", $$1, $$2}'
	@echo "--------------------------------------------------------------------------------------------"
	@printf "\033[32mTests:%-30s\033[0m %s\n"
	@grep -E '^[a-zA-Z_-]+:.*?##3 .*$$' $(firstword $(MAKEFILE_LIST)) | awk 'BEGIN {FS = ":.*?##3 "}; {printf "\033[32m  - %-30s\033[0m %s\n", $$1, $$2}'
	@echo "--------------------------------------------------------------------------------------------"
	@printf "\033[35mDevOps:%-30s\033[0m %s\n"
	@grep -E '^[a-zA-Z_-]+:.*?##4 .*$$' $(firstword $(MAKEFILE_LIST)) | awk 'BEGIN {FS = ":.*?##4 "}; {printf "\033[35m  - %-30s\033[0m %s\n", $$1, $$2}'

# ---------------------------------------------------------------------------------------------

install: ##1 Installs all dependencies
	npm install 

clean: ##1 Cleans all dependencies
	rm -rf node_modules

# ---------------------------------------------------------------------------------------------

pr: ##2 Prepares a pull request
	./node_modules/.bin/prettier --write "src/**/*.js"
	make eslint -B
	make jest -B

# ---------------------------------------------------------------------------------------------

jest: ##3 Runs JS Unit Tests
	@./node_modules/.bin/jest --config=./.jest.config.js --runInBand --detectOpenHandles --forceExit --coverage

eslint: ##3 Starts the ESLinter
	./node_modules/.bin/eslint --config ./.eslintrc.json ./src

prettier: ##3 Starts Prettier
	./node_modules/.bin/prettier --check "src/**/*.js"

# ---------------------------------------------------------------------------------------------

setup: ##4 Runs the setup wizard when using this project
	npm run-script setup
