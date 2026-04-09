// Custom Prism theme inspired by terminal / htop color palette.
// Dark background with bright-green default text, cyan for identifiers,
// yellow for strings, and white for numbers — matching the htop aesthetic.

const terminalTheme = {
  plain: {
    color: '#33ee55',
    backgroundColor: '#090909',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: '#2d6e3a', fontStyle: 'italic' },
    },
    {
      types: ['punctuation'],
      style: { color: '#4dbb66' },
    },
    {
      types: ['namespace'],
      style: { opacity: 0.7 },
    },
    {
      types: ['keyword', 'tag', 'operator', 'boolean', 'constant'],
      style: { color: '#00ffcc' },
    },
    {
      types: ['selector', 'attr-name', 'symbol', 'deleted'],
      style: { color: '#05dc60' },
    },
    {
      types: ['string', 'char', 'builtin', 'inserted', 'attr-value'],
      style: { color: '#e8e832' },
    },
    {
      types: ['number', 'unit'],
      style: { color: '#ffffff' },
    },
    {
      types: ['function', 'class-name'],
      style: { color: '#66ffaa' },
    },
    {
      types: ['variable'],
      style: { color: '#33ee55' },
    },
    {
      types: ['property'],
      style: { color: '#aaffcc' },
    },
    {
      types: ['regex', 'important'],
      style: { color: '#e8e832', fontStyle: 'italic' },
    },
  ],
};

export default terminalTheme;
