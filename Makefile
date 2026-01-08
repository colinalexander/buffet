.PHONY: test test-cov eval run-example run-skill founder-demo pages

test:
	uv run pytest -q

test-cov:
	uv run pytest --cov=src/buffet --cov-report=term-missing

eval:
	uv run python -m buffet.simulation.eval_procedures

run-example:
	uv run python -m buffet.execution.run_example \
		--mandate mandates/liability_driven/db_pension_v1/mandate.yaml \
		--scenario judgment_loops/rate_regime_adjustment/scenarios/rising_rates_2022.yaml
	uv run python -m buffet.execution.run_example \
		--mandate mandates/perpetual_capital/endowment_v1/mandate.yaml \
		--scenario judgment_loops/rate_regime_adjustment/scenarios/rising_rates_2022.yaml

run-skill:
	uv run python -m buffet.execution.run_skill \
		--mandate mandates/liability_driven/db_pension_v1/mandate.yaml \
		--scenario judgment_loops/rate_regime_adjustment/scenarios/rising_rates_2022.yaml

founder-demo:
	bash scripts/demo.sh

pages:
	make eval
	make run-example
	uv run python -m buffet.execution.run_example \
		--mandate mandates/liability_driven/db_pension_v1/mandate.yaml \
		--scenario judgment_loops/rate_regime_adjustment/scenarios/escalation_case.yaml
	mkdir -p docs/figures
	cp documentation/figures/banner.png docs/figures/banner.png
	uv run python scripts/publish_pages_data.py --clean
	@echo "Open docs/index.html locally or enable GitHub Pages on /docs."
