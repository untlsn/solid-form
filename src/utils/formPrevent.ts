/**
 * Trigger preventDefault and stopPropagation from event
 */
export default function formPrevent(ev: Event) {
	ev.preventDefault();
	ev.stopPropagation();
}
