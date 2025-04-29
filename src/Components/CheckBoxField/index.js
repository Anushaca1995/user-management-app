import styles from './styles.scss';

const CheckBoxField = ({ label, name, checked, onChange }) => {
  return (
    <div className="form-group checkbox-group">
      <label>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
        />
        {label}
      </label>
    </div>
  );
};

export default CheckBoxField;
