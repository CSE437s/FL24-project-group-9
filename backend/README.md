# Install Poetry

Before running the backend, one needs to install [Poetry - A Dependency Manager](https://python-poetry.org/).

See instructions [on the official website](https://python-poetry.org/docs/master/#installation) or [this guide](https://realpython.com/dependency-management-python-poetry/#install-poetry-on-your-computer) to install Poetry.

```
cd backend
python3 -m pip install poetry
```

To check if Poetry is already installed:

```
poetry --version
```

### Install dependencies locally

One can review added dependencies in `pyproject.toml`. To install existing dependencies:

```
poetry install
```

### Add a new dependency

The general syntax is:

```
poetry add <dependency name>
```

To explicitly tell Poetry that a package is a development dependency, one runs `poetry add` with the `--dev` option. One can also use a shorthand `-D` option, which is the same as `--dev`:

```
poetry add <dependency name> -D
```

### Update a dependency

First, review the version constraint for that dependency in `pyproject.toml`. If the dependency you want to update does not appear here, it is a transitive dependency. But if it has an equality constraint, consider changing it first or poetry will stick to the currently selected version.

Then, run:

```
poetry update <package1> <package2> ... <packageN>
```

with all packages that need an update. Review its effect on `poetry.lock`. Make sure to commit the change.

To update all packages and their dependencies within their version constraints, run:

```
poetry update
```

Note: if there is a large change on `poetry.lock` when updating a single package, check that you are using poetry 1.1

# Run the backend locally in the automatically created virtual environment

Remember to install all packages in Poetry first:

```
poetry install
```

To run server:

```
poetry run python3 manage.py runserver
```

To create new app in django:

```
poetry run python3 manage.py startapp <app name>
```

After making any changes to the models, to create migration files based on the new models:

```
poetry run python3 manage.py makemigrations
```

To applying the migration files (created by `makemigrations`) to the database:

```
poetry run python3 manage.py migrate
```

To access the database dashboard at `http://127.0.0.1:8000/admin/`, create superuser:

```
poetry run python3 manage.py createsuperuser
```

To seed data into the database:

```
poetry run python3 manage.py seed_data
```

To run unittests:
```
poetry run python3 manage.py test
```
