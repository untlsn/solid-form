export default function formPrevent(ev: Event) {
	ev.preventDefault();
	ev.stopPropagation();
}
