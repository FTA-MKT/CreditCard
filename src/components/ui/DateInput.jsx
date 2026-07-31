import React from 'react';

// Native <input type="date"> renders its empty placeholder segments (and, in
// some browsers, the calendar affordance) using the browser/OS locale rather
// than the page's `lang` attribute — Chromium ignores `lang` entirely for
// this control, so a user with a non-English browser locale sees native text
// like "年/月/日" with no way to override it from HTML/CSS/JS on the element.
// Once a real value is set, the control renders it as plain MM/DD/YYYY
// regardless of locale, so the fix only needs to cover the idle empty state
// (the one actually visible on page load, before any interaction): hide the
// native placeholder and show a fixed English one in its place.
//
// The overlay is dropped as soon as the field is focused rather than only
// when a value exists — the browser's internal segment-editing state (what
// the user is mid-typing) is separate from the DOM `value`, which only
// updates once a complete date is entered. Keeping the overlay up while
// focused would hide that in-progress typing feedback entirely. So typing
// briefly falls back to native (locale-dependent) segment labels, same as
// the native calendar-picker popup always has — neither is overridable from
// CSS/JS in Chromium. The underlying value stays a standard ISO date string
// exactly as before; no change to how callers store or compare dates.
export function EnDateInput({ value, onChange, placeholder = 'MM/DD/YYYY', style }) {
  const [focused, setFocused] = React.useState(false);
  const hideNative = !value && !focused;

  return (
    <>
      <input
        type="date"
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ color: hideNative ? 'transparent' : undefined, ...style }}
      />
      {hideNative && (
        <span
          style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            fontSize: 13, color: 'var(--fta-text-2)', pointerEvents: 'none',
          }}
        >
          {placeholder}
        </span>
      )}
    </>
  );
}
