// This port owns its application mappings. Inputs come only from the pinned local palette.
import { readFileSync } from 'node:fs';

const license = readFileSync(new URL('../LICENSE', import.meta.url), 'utf8');

function uuid(seed) {
  let h = 2166136261;
  const out = [];
  for (let i = 0; i < 32; i++) {
    h ^= seed.charCodeAt(i % seed.length) + i;
    h = Math.imul(h, 16777619) >>> 0;
    out.push((h & 15).toString(16));
  }
  const s = out.join("");
  return `${s.slice(0, 8)}-${s.slice(8, 12)}-4${s.slice(13, 16)}-a${s.slice(17, 20)}-${s.slice(20, 32)}`;
}

function plistDict(obj, indent) {
  const pad = "\t".repeat(indent);
  return `${pad}<dict>\n${Object.entries(obj).map(([k, v]) => `${pad}\t<key>${esc(k)}</key>\n${pad}\t<string>${esc(v)}</string>`).join("\n")}\n${pad}</dict>`;
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const SCOPES = [
  { role: "comment", scope: ["comment", "punctuation.definition.comment", "string.quoted.docstring"] },
  { role: "keyword", scope: ["keyword", "storage.type", "storage.modifier", "keyword.control", "keyword.operator.new", "keyword.operator.expression", "keyword.operator.logical.python", "keyword.operator.logical.lua", "keyword.operator.wordlike", "keyword.operator.word", "keyword.other", "punctuation.definition.template-expression", "punctuation.section.embedded", "punctuation.definition.keyword", "punctuation.section.interpolation"] },
  { role: "operator", scope: ["keyword.operator", "storage.type.function.arrow"] },
  { role: "punctuation", scope: ["punctuation", "meta.brace", "punctuation.definition.tag", "punctuation.separator", "punctuation.terminator", "punctuation.accessor"] },
  { role: "string", scope: ["string", "punctuation.definition.string", "string.template"] },
  { role: "escape", scope: ["constant.character.escape", "constant.other.placeholder", "constant.character.format", "constant.character.entity"] },
  { role: "regex", scope: ["string.regexp"] },
  { role: "number", scope: ["constant.numeric", "keyword.other.unit"] },
  // Constant values only (true, null, built-in constants, colors). The names that hold constants are names: RADIUS
  // (variable.other.constant, constant.other.caps, Sublime's entity.name.constant) takes the variable color and enum
  // members the property color, as JetBrains draws them; see the variable and property entries below.
  { role: "constant", scope: ["constant.language", "constant.other", "support.constant", "constant.other.color"] },
  { role: "function", scope: ["entity.name.function", "support.function", "meta.function-call.generic", "variable.function", "entity.name.function.member"] },
  { role: "type", scope: ["entity.name.type", "entity.name.class", "support.type", "support.class", "entity.other.inherited-class", "storage.type.primitive", "storage.type.built-in", "storage.type.numeric.go", "storage.type.boolean.go", "storage.type.string.go", "storage.type.byte.go", "storage.type.rune.go", "storage.type.error.go", "storage.type.uintptr.go", "support.class.component", "entity.other.attribute-name.class.css", "entity.other.attribute-name.id.css", "entity.name.struct", "entity.name.enum", "entity.name.union", "entity.name.trait", "entity.name.interface", "entity.name.impl"] },
  { role: "namespace", scope: ["entity.name.namespace", "entity.name.type.module", "entity.name.scope-resolution", "support.module"] },
  { role: "decorator", scope: ["meta.decorator", "entity.name.function.decorator", "punctuation.decorator", "punctuation.definition.decorator", "meta.decorator variable", "meta.decorator variable.other", "meta.decorator variable.other.readwrite", "meta.decorator entity.name.function", "storage.type.annotation", "meta.attribute.rust", "entity.name.function.macro", "entity.name.function.preprocessor", "meta.preprocessor", "keyword.control.directive", "entity.name.type.lifetime", "punctuation.definition.lifetime", "meta.annotation", "variable.annotation", "punctuation.definition.annotation", "entity.name.label", "entity.other.attribute-name.pseudo-class", "entity.other.attribute-name.pseudo-element"] },
  // Includes are imports (Neovim's @keyword.import), unlike the other preprocessor directives.
  { role: "keyword", scope: ["keyword.control.directive.include", "keyword.control.directive.import", "keyword.control.import"] },
  { role: "tag", scope: ["entity.name.tag"] },
  { role: "attribute", scope: ["entity.other.attribute-name"] },
  { role: "property", scope: ["variable.other.enummember", "variable.other.constant.property", "variable.other.property", "variable.other.object.property", "variable.object.property", "support.variable.property", "meta.object-literal.key", "support.type.property-name", "punctuation.support.type.property-name", "entity.name.tag.yaml", "entity.name.tag.toml", "variable.other.key.toml", "support.type.property-name.json", "meta.attribute.python"] },
  { role: "parameter", scope: ["variable.parameter", "meta.parameter variable"] },
  { role: "builtin", scope: ["variable.language", "support.variable", "variable.language.this", "variable.language.self", "variable.language.super", "variable.parameter.function.language.special"] },
  { role: "variable", scope: ["variable", "meta.definition.variable", "variable.other.readwrite", "variable.other.constant", "constant.other.caps", "entity.name.constant"] },
  { role: "heading", scope: ["markup.heading", "entity.name.section", "markup.heading punctuation.definition.heading"] },
  { role: null, scope: ["markup.bold"], fontStyle: "bold" },
  { role: null, scope: ["markup.italic"], fontStyle: "italic" },
  { role: null, scope: ["markup.strikethrough"], fontStyle: "strikethrough" },
  { role: null, scope: ["markup.underline"], fontStyle: "underline" },
  { role: "link", scope: ["markup.underline.link", "string.other.link", "markup.link"] },
  { role: "code", scope: ["markup.inline.raw", "markup.fenced_code", "markup.raw"] },
  { role: "quote", scope: ["markup.quote"] },
  { role: "accent", scope: ["punctuation.definition.list", "markup.list punctuation.definition"] },
  { role: "added", scope: ["markup.inserted", "meta.diff.header.to-file", "punctuation.definition.inserted"] },
  { role: "removed", scope: ["markup.deleted", "meta.diff.header.from-file", "punctuation.definition.deleted"] },
  { role: "modified", scope: ["markup.changed", "punctuation.definition.changed"] },
  { role: "fgSubtle", scope: ["meta.diff.range", "meta.diff.index", "meta.separator"] },
  { role: "error", scope: ["invalid", "invalid.illegal"] },
  { role: "warning", scope: ["invalid.deprecated"] },
];

const scopeRules = (f) =>
  SCOPES.map(({ role, scope, fontStyle }) => {
    const settings = {};
    if (role) settings.foreground = f.r(role);
    const style = fontStyle ?? (role && f.styles[role]);
    if (style) settings.fontStyle = style;
    return { scope, settings };
  });

const tmtheme = {
files: (f) => {
    const global = {
      background: f.r("bg"), foreground: f.r("fg"), caret: f.r("cursor"),
      lineHighlight: f.r("lineHighlight"), selection: f.r("selection"),
      invisibles: f.c("surface1"), gutter: f.r("bg"), gutterForeground: f.r("lineNumber"),
      findHighlight: f.r("match"), findHighlightForeground: f.r("bg"),
      bracketsForeground: f.r("accent"), guide: f.c("surface0"), activeGuide: f.c("surface2"),
    };
    const rules = scopeRules(f).map(({ scope, settings }) => `\t\t<dict>
\t\t\t<key>scope</key>
\t\t\t<string>${esc(scope.join(", "))}</string>
\t\t\t<key>settings</key>
${plistDict(settings, 3)}
\t\t</dict>`).join("\n");
    return [{
      path: `${f.slug}.tmTheme`,
      content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
\t<key>name</key>
\t<string>${f.name}</string>
\t<key>settings</key>
\t<array>
\t\t<dict>
\t\t\t<key>settings</key>
${plistDict(global, 3)}
\t\t</dict>
${rules}
\t</array>
\t<key>uuid</key>
\t<string>${uuid(f.slug)}</string>
</dict>
</plist>
`,
    }];
  }
};

const style = (fg, extra = {}) => {
  const parts = [`fg = "${fg}"`, ...Object.entries(extra).map(([k, v]) => (typeof v === "boolean" ? `${k} = ${v}` : `${k} = "${v}"`))];
  return `{ ${parts.join(", ")} }`;
};

function yaziFlavor(f) {
  const s = (fg, bg, bold) => style(fg, { ...(bg ? { bg } : {}), ...(bold ? { bold: true } : {}) });
  const accent = f.r("accent"), bg = f.r("bg"), fg = f.r("fg"), sel = f.r("selection"), surf = f.c("surface0");
  return `# ${f.name}: https://github.com/living-code-theme/yazi
# Syntax highlighting in the preview pane comes from tmtheme.xml next to this file.

[mgr]
cwd = ${s(accent)}
find_keyword = ${s(f.r("match"), null, true)}
find_position = ${s(f.c("orchid"), null, true)}
symlink_target = ${s(f.r("link"))}
marker_copied = { fg = "${f.r("success")}", bg = "${f.r("success")}" }
marker_cut = { fg = "${f.r("error")}", bg = "${f.r("error")}" }
marker_marked = { fg = "${f.c("orchid")}", bg = "${f.c("orchid")}" }
marker_selected = { fg = "${f.r("warning")}", bg = "${f.r("warning")}" }
count_copied = ${s(bg, f.r("success"))}
count_cut = ${s(bg, f.r("error"))}
count_selected = ${s(bg, f.r("warning"))}
border_symbol = "│"
border_style = ${s(f.r("border"))}

[indicator]
parent = { fg = "${fg}", bg = "${surf}" }
current = { fg = "${fg}", bg = "${sel}" }
preview = { bg = "${surf}" }
padding = { open = "", close = "" }

[tabs]
active = ${s(bg, accent, true)}
inactive = ${s(f.r("fgMuted"), surf)}

[mode]
normal_main = ${s(bg, accent, true)}
normal_alt = ${s(accent, surf)}
select_main = ${s(bg, f.r("warning"), true)}
select_alt = ${s(f.r("warning"), surf)}
unset_main = ${s(bg, f.c("orchid"), true)}
unset_alt = ${s(f.c("orchid"), surf)}

[status]
overall = ${s(fg, surf)}
sep_left = { open = "", close = "" }
sep_right = { open = "", close = "" }
perm_type = ${s(f.r("info"))}
perm_read = ${s(f.r("warning"))}
perm_write = ${s(f.r("error"))}
perm_exec = ${s(f.r("success"))}
perm_sep = ${s(f.r("fgSubtle"))}
progress_label = ${s(fg, null, true)}
progress_normal = ${s(accent, f.c("surface1"))}
progress_error = ${s(f.r("error"), f.c("surface1"))}

[which]
cols = 3
border = ${s(f.r("borderActive"))}
mask = ${s(fg, surf)}
cand = ${s(f.r("function"))}
rest = ${s(f.r("fgSubtle"))}
desc = ${s(f.c("orchid"))}
separator = "  "
separator_style = ${s(f.r("fgSubtle"))}

[confirm]
border = ${s(f.r("borderActive"))}
title = ${s(f.r("borderActive"))}
body = ${s(fg)}
list = ${s(fg)}
btn_yes = { reversed = true }
btn_no = {}
btn_labels = ["  [Y]es  ", "  (N)o  "]

[spot]
border = ${s(f.r("borderActive"))}
title = ${s(f.r("borderActive"))}
tbl_col = ${s(accent)}
tbl_cell = ${s(f.r("warning"), sel)}

[notify]
title_info = ${s(f.r("success"))}
title_warn = ${s(f.r("warning"))}
title_error = ${s(f.r("error"))}

[pick]
border = ${s(f.r("borderActive"))}
active = ${s(f.c("orchid"), null, true)}
inactive = ${s(fg)}

[input]
border = ${s(f.r("borderActive"))}
title = {}
value = {}
selected = { reversed = true }

[cmp]
border = ${s(f.r("borderActive"))}
active = { reversed = true }
inactive = {}

[tasks]
border = ${s(f.r("borderActive"))}
title = {}
hovered = ${s(f.c("orchid"), null, true)}

[help]
border = ${s(f.r("borderActive"))}
chord = ${s(f.c("copper"))}
action = ${s(f.r("function"))}
hovered = { reversed = true, bold = true }

[filetype]
rules = [
  { mime = "image/*", fg = "${f.c("copper")}" },
  { mime = "{audio,video}/*", fg = "${f.c("orchid")}" },
  { mime = "application/{zip,rar,7z*,tar,gzip,xz,zstd,bzip*,lzma,compress,archive,cpio,arj,xar,ms-cab*}", fg = "${f.r("error")}" },
  { mime = "application/{pdf,doc,rtf}", fg = "${f.r("warning")}" },
  { mime = "inode/empty", fg = "${f.r("fgSubtle")}" },
  { url = "*", is = "orphan", fg = "${f.r("error")}" },
  { url = "*", is = "exec", fg = "${f.r("success")}" },
  { url = "*/", fg = "${accent}" },
]
`;
}

const yaziFlavorPath = (f, file) => `${f.slug}.yazi/${file}`;

const yazi = {
files: (f) => [
    { path: yaziFlavorPath(f, "flavor.toml"), content: yaziFlavor(f) },
    { path: yaziFlavorPath(f, "tmtheme.xml"), content: tmtheme.files(f)[0].content },
    { path: yaziFlavorPath(f, "LICENSE"), content: license },
  ]
};

export function generate(flavors) {
  return [...flavors.flatMap(f => yazi.files(f)), ...(yazi.all?.(flavors) ?? [])].filter(f => !["LICENSE", "README.md", "package.json", "extension.toml"].includes(f.path.split("/").at(-1)));
}
