module.exports = {
    subject: '',
    text:
`Hello

Your FlowFuse Project {{{ name }}} has crashed and has been
placed into Safe Mode

You can access the logs here:

{{{ url }}}
`,
    html:
`<p>Hello</p>
<p>Your FlowFuse Project {{{ name }}} has crashed and has been placed in Safe Mode</p>

<p>You can access the logs here</p>
<a href="{{{ url }}}">{{{ url }}}</a>
`
}
