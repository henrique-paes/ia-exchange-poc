import { Tag } from '../api/types';
import s from './TagPicker.module.css';

// Controlled multi-select tag picker (checkboxes). Receives tags by prop —
// no API calls here. Deduplicates ids on onChange (book.tags.unique).
// aria-label="book tags" or "filter by tags" passed by caller.
export function TagPicker({
  tags,
  value,
  onChange,
  label,
  ariaLabel,
}: {
  tags: Tag[];
  value: string[];
  onChange: (ids: string[]) => void;
  label?: string;
  ariaLabel?: string;
}) {
  function toggle(id: string) {
    const next = value.includes(id)
      ? value.filter((v) => v !== id)
      : [...new Set([...value, id])];
    onChange(next);
  }

  return (
    <fieldset className={s.fieldset} aria-label={ariaLabel}>
      {label && <legend className={s.legend}>{label}</legend>}
      <div className={s.options}>
        {tags.map((tag) => {
          const checked = value.includes(tag.id);
          return (
            <label key={tag.id} className={s.option}>
              <input
                type="checkbox"
                className={s.checkbox}
                checked={checked}
                onChange={() => toggle(tag.id)}
              />
              <span>{tag.name}</span>
            </label>
          );
        })}
        {tags.length === 0 && <span className={s.empty}>No tags available</span>}
      </div>
    </fieldset>
  );
}
