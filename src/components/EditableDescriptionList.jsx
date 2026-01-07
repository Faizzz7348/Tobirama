import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

export function EditableDescriptionList({ value, onSave, isEditable = true }) {
    const parseItems = (text) => {
        if (!text || !text.trim()) return [];
        return text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map((line, index) => {
                // Check if line has format "term : definition"
                if (line.includes(' : ')) {
                    const [term, ...defParts] = line.split(' : ');
                    return {
                        term: term.trim() || `Item ${index + 1}`,
                        definition: defParts.join(' : ').trim()
                    };
                }
                // Default format without term
                return {
                    term: `Item ${index + 1}`,
                    definition: line
                };
            });
    };

    const [items, setItems] = useState(parseItems(value));
    const [lastValue, setLastValue] = useState(value);

    // Only sync from parent when value actually changes externally
    useEffect(() => {
        if (value !== lastValue) {
            const currentSerialized = items.map(item => item.definition).join('\n');
            const incomingParsed = parseItems(value);
            const incomingSerialized = incomingParsed.map(item => item.definition).join('\n');
            
            if (currentSerialized !== incomingSerialized) {
                setItems(incomingParsed);
                setLastValue(value);
            }
        }
    }, [value, lastValue, items]);

    const serializeItems = (itemsToSerialize) => {
        return itemsToSerialize
            .filter(item => item.definition.trim() || item.term.trim())
            .map(item => {
                if (item.term.trim() && item.definition.trim()) {
                    return `${item.term.trim()} : ${item.definition.trim()}`;
                }
                return item.definition.trim();
            })
            .join('\n');
    };

    const handleAddItem = () => {
        const newItems = [...items, { term: `Item ${items.length + 1}`, definition: '' }];
        setItems(newItems);
        const newValue = serializeItems(newItems);
        onSave(newValue);
    };

    const handleRemoveItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        const newValue = serializeItems(newItems);
        onSave(newValue);
    };

    const handleTermChange = (index, newTerm) => {
        const newItems = [...items];
        newItems[index].term = newTerm;
        setItems(newItems);
    };

    const handleTermBlur = (index) => {
        const newValue = serializeItems(items);
        onSave(newValue);
    };

    const handleDefinitionChange = (index, newDefinition) => {
        const newItems = [...items];
        newItems[index].definition = newDefinition;
        setItems(newItems);
    };

    const handleDefinitionBlur = (index) => {
        const newValue = serializeItems(items);
        onSave(newValue);
    };

    if (!isEditable) {
        const displayItems = parseItems(value);
        return (
            <div style={{ fontSize: '10px' }}>
                {displayItems.length > 0 ? (
                    <dl style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
                        {displayItems.map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <dt style={{ 
                                    minWidth: '80px', 
                                    flexShrink: 0, 
                                    fontWeight: 600,
                                    color: '#3b82f6'
                                }}>
                                    {item.term}
                                </dt>
                                <dd style={{ 
                                    flex: 1, 
                                    color: 'var(--text-color)',
                                    margin: 0 
                                }}>
                                    {item.definition}
                                </dd>
                            </div>
                        ))}
                    </dl>
                ) : (
                    <p style={{ color: 'var(--text-color-secondary)', fontSize: '10px' }}>
                        No information available
                    </p>
                )}
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {items.map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <InputText
                                value={item.term}
                                onChange={(e) => handleTermChange(index, e.target.value)}
                                onBlur={() => handleTermBlur(index)}
                                style={{ width: '96px', fontSize: '10px' }}
                                placeholder="Term"
                            />
                            <InputText
                                value={item.definition}
                                onChange={(e) => handleDefinitionChange(index, e.target.value)}
                                onBlur={() => handleDefinitionBlur(index)}
                                style={{ flex: 1, fontSize: '10px' }}
                                placeholder="Definition"
                            />
                            <Button
                                icon="pi pi-trash"
                                onClick={() => handleRemoveItem(index)}
                                className="p-button-text p-button-danger"
                                style={{ padding: '0.5rem' }}
                                tooltip="Remove"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ color: 'var(--text-color-secondary)', fontSize: '10px' }}>
                    No items yet. Click "Add Item" to start.
                </p>
            )}
            
            <Button
                label="Add Item"
                icon="pi pi-plus"
                onClick={handleAddItem}
                className="p-button-text"
                style={{ fontSize: '10px', alignSelf: 'flex-start' }}
            />
        </div>
    );
}
