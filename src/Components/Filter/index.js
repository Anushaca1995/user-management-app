import styles from './styles.scss';

const Filter = ({ label, value, options, onChange }) => (
    <div className="filter-group">
      <label className="filter-label">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="filter-dropdown">
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
  
  export default Filter;
  