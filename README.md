## React, Redux

The "Code Helpers" project is a toolkit designed to facilitate code writing by providing useful snippets, formatting rules, and commands for convenient development.

## Code Helpers

- Pass the notification in the following way:

```bash
  {error && <Notification errorResponse={{ message: error }} />}
```

## Code Guide

### Date Writing Order (date)

- Format:

```
  YYYY.MM.DD, HH:MM:SS
```

- SCSS Code Rules
  Use a mixin for fonts:

```bash
  @include font(16, 16, 400, цвет);
```

- Request Code Rules. For HTTP requests, use only the axios library. Example of a basic API:

```bash
import { get, post, put, del } from 'src/api/baseApi';
```

- Additional Rules

  For the grid, use the mixin: @include flexbox();
  For margins, use the mixin: @include pxToRem(16);
  Check files for compliance with the style: yarn check-format || yarn format

## IMPORTANT: No need to import React and others anymore; it's configured in Webpack to be loaded automatically.

### Use Preact Instead of React

- For hooks, import from here:

```bash
import { useState, useEffect, useRef, useMemo, useCallback, useReducer, useContext } from 'preact/hooks';
```

- For other functions, import from here:

```bash
import { memo, Fragment, createPortal, forwardRef, Children } from 'preact/compat';
```

### SCSS Code Rules

- For fonts, use the mixin:

```bash
@include font(16, 16, 400, цвет)
```

### Request Code Rules

- Use only axios

```bash
базовый апи src/api/baseApi (используем необходимый метод)
```

- For the grid, use the mixin:

```bash
@include flexbox();
```

- For margins, use the mixin:

```bash
@include pxToRem(16);
```

- Check files for compliance with the style:

```bash
yarn check-format || yarn format
```

## Commands

```bash
yarn  prettier      # Automatically formats files with the extensions .js and .jsx according to the configuration .prettierrc.json.
yarn  lint          # Runs ESLint to check the code in the src/ directory. The --debug flag allows displaying additional debugging information.
yarn  lint:write    # Uses ESLint to check the code in the src/ directory, but with the --fix flag, which automatically fixes simple issues.
yarn  format        # Sequentially runs Prettier, then ESLint for files with the extensions .js and .jsx, and then Stylelint for SCSS files to automatically fix them.
yarn  check-format  # Performs a formatting check (without fixes) for files with the extensions .js and .jsx, and then checks the style using ESLint and Stylelint with the --quiet flag to avoid unnecessary output.
yarn  pre-commit      # Runs lint-staged (a command to check only changed files) and then tests before committing and before pushing changes to the repository.

lsof -i :3000     #  Find out the port and reset it via kill -9.
```

## Structure

```bash
build/       # Build folder (result of work on the project)
src/         # Source files
  assets/    # Fonts, Mixins, Style container
  component/ # Components
  elements/  # Elements like input, dropdown, Switcher, etc.
  pages/     # Project pages
  store/     # Redux utility files
  shared/    # Functions and utilities
public/      # Source files
  img/       # Images shared across all blocks
  js/        # Common js files, including the webpack build entry point and shared modules
```
