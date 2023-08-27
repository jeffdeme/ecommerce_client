function Alert(props) {

    return (
        <div style={{ marginBottom: '10px', width: '100%', fontSize: '.65rem', fontStyle: 'italic', background: props.bg, color: props.color, borderRadius: '4px', padding: '3px 10px', textAlign: 'center', border: `1px solid ${props.color}` }}>{props.msg}</div>
    )
}

export default Alert