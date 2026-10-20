<!-- living-code-readme:1 -->
# 🦆 Living Code for yazi

**Calm slate. Living color.** Living Code for yazi. Repository-owned theme files, installation instructions and four color flavors.

[Installation](#installation) · [Flavors](#flavors) · [Configuration](#configuration) · [All ports](https://github.com/living-code-theme)

## Previews

<table data-lc-flavors>
<tr>
<td width="50%" valign="top">
<strong>Night</strong><br><sub>Dark · full palette</sub><br><br>
<a href="images/night.png"><img src="images/night.png" alt="yazi running Living Code Night" width="640"></a>
</td>
<td width="50%" valign="top">
<strong>Frost</strong><br><sub>Dark · softer chroma</sub><br><br>
<a href="images/frost.png"><img src="images/frost.png" alt="yazi running Living Code Frost" width="640"></a>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<strong>Paper</strong><br><sub>Light · near-white slate</sub><br><br>
<a href="images/paper.png"><img src="images/paper.png" alt="yazi running Living Code Paper" width="640"></a>
</td>
<td width="50%" valign="top">
<strong>Signal</strong><br><sub>Dark · teal accent</sub><br><br>
<a href="images/signal.png"><img src="images/signal.png" alt="yazi running Living Code Signal" width="640"></a>
</td>
</tr>
</table>

Select any preview to view the image at full size.

## Installation

Install the Night and Paper flavors from this repository's root-level flavor directories:

```sh
ya pkg add living-code-theme/yazi:living-code-night
ya pkg add living-code-theme/yazi:living-code-paper
```

Use `living-code-frost` or `living-code-signal` instead for another dark flavor. Then configure `~/.config/yazi/theme.toml`:

```toml
[flavor]
dark = "living-code-night"
light = "living-code-paper"
```

For a manual install, copy a complete `living-code-<flavor>.yazi` directory into Yazi's `flavors` directory. On Windows it is `%AppData%\yazi\config\flavors`.

## Flavors

Expand a flavor for its full-size preview and activation instructions.

<details data-lc-flavor="night">
<summary><strong>Night</strong> · Dark · full palette</summary>

<p><a href="images/night.png"><img src="images/night.png" alt="yazi running Living Code Night" width="1280"></a></p>

Select the installed flavor in `theme.toml`:

```toml
[flavor]
dark = "living-code-night"
```

</details>

<details data-lc-flavor="frost">
<summary><strong>Frost</strong> · Dark · softer chroma</summary>

<p><a href="images/frost.png"><img src="images/frost.png" alt="yazi running Living Code Frost" width="1280"></a></p>

Select the installed flavor in `theme.toml`:

```toml
[flavor]
dark = "living-code-frost"
```

</details>

<details data-lc-flavor="paper">
<summary><strong>Paper</strong> · Light · near-white slate</summary>

<p><a href="images/paper.png"><img src="images/paper.png" alt="yazi running Living Code Paper" width="1280"></a></p>

Select the installed flavor in `theme.toml`:

```toml
[flavor]
light = "living-code-paper"
```

</details>

<details data-lc-flavor="signal">
<summary><strong>Signal</strong> · Dark · teal accent</summary>

<p><a href="images/signal.png"><img src="images/signal.png" alt="yazi running Living Code Signal" width="1280"></a></p>

Select the installed flavor in `theme.toml`:

```toml
[flavor]
dark = "living-code-signal"
```

</details>

## Configuration

See [yazi's documentation](https://yazi-rs.github.io) for application settings and reload behavior. The activation instructions above identify each supported flavor; keep your other application configuration.

## Compatibility

This port supplies theme files for yazi, not the application itself. Install the application separately and follow the installation instructions for its supported configuration format.

## Contributing

Found a problem? [Open an issue](https://github.com/living-code-theme/yazi/issues/new/choose) with the app version, the flavor and a screenshot. Want Living Code somewhere else? [Request a port](https://github.com/living-code-theme/core/issues/new?template=port-request.yml).

Pull requests are welcome. Keep this README, `port.json` and `images/` in sync, and use real screenshots of the app, never mockups.

🦎 **One chameleon, many habitats.** Part of [Living Code](https://github.com/living-code-theme).

## License

[MIT](LICENSE) © Elliot Luque
