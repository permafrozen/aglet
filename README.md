# Aglet

## Description
Gtk shell for desktop usage made with astal and bundled with ags.

## Table of Contents
1. [Description](#description)
2. [Installation](#installation)
3. [Dependencies](#dependencies)
4. [Development](#development)

## installation
Use a flake to install it by using this repository as an input and add `inputs.aglet.packages.x86_64-linux.default` to `environment.systemPackages`. Don't forget to pass `inputs` to `specialArgs` or `extraSpecialArgs` *(for home-manager)* to use it anywhere in the configuration.

### `inputs` example (`flake.nix`)
```nix
  inputs = {
      # ...
    aglet = {
      url = "github:Permafrozen/aglet";
      inputs.nixpkgs.follows = "nixpkgs";
    };
      # ...
  }
```

### Usage example *(anywhere in the config)*
```nix
{ inputs, ... }:

{
  # astal config from remote flake
  environment.systemPackages = [ inputs.aglet.packages.x86_64-linux.default ];

  # dependencies (look #dependencies for more info)
  services.upower.enable = true;
  # ...
}
```

## Dependencies

1. For the battery module to work you need a `upower` **daemon** running. Otherwise it will always say `0%`

## Development

1. Clone Repository
```console
git clone https://github.com/Permafrozen/aglet.git
```

2. Enter Development-Shell
```console
cd aglet/
nix delevop
```

3. Generate Types
```console
cd src/
ags types -d . -p
```

> [!IMPORTANT]
> You also need `inotify-tools` if you want to use the `dev.sh` script.

4. Documentation
    - https://aylur.github.io/astal/guide/libraries/references
