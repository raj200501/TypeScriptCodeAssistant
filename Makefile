.PHONY: install dev build test lint typecheck format verify

install:
	npm install

dev:
	npm run dev

build:
	npm run build

test:
	npm run test

lint:
	npm run lint

typecheck:
	npm run typecheck

format:
	npm run format:write

verify:
	npm run verify

.PHONY: setup fmt run doctor verify-script

setup: install

fmt:
	npm run format:write

run: dev

doctor:
	npm run doctor

verify-script:
	scripts/verify.sh
