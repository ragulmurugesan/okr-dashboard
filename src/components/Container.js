import React, { useState, useEffect } from 'react';
import { SAMPLE_OKR, OKR_CATEGORY_OPTIONS } from '../utils/constants/okr.constant';
import OkrSegment from './OkrSegment';
import NoData from './NoData'
import AppLogo from '../assets/icons/heading-logo.png'
import ErrorBoundary from './ErrorBoundary';

/**
 * Container component - Root level component 
 * 
 */
export default function Container() {

    const [state, setState] = useState({ okrData: {} });
    const [category, setCategory] = useState('Company');

    /**
     * Method is invoked to construc the object from the data received
     * @param {*} data OKR Data received from API call is passed here
     * @param {*} category Name of the category is received
     */
    const constructJSON = (data = [], category = '') => {
        let cache = {};
        data.forEach(item => {
            let id = item.id;
            let parentId = item.parent_objective_id;
            let title = item.title;
            if (!parentId) {
                (item.category === category) && (cache[id] = { title: title, children: [] });
            }
            else if (cache[parentId]) cache[parentId].children.push(item);
        })
        setState({ okrData: cache });
    }

    /**
     * Hook - Defined here to be invoked everytime category changes...
     */
    useEffect(() => {
        fetch(SAMPLE_OKR)
            .then(res => res.json())
            .then(value => constructJSON(value.data, category));
    }, [category]);

    /**
     * Method to handle the category change event - Event Handler
     * @param {*} event Change event is received 
     */
    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    }

    return (
        <>
            {/* <img className="ally-logo" src={AppLogo} alt="Ally logo" /> */}
            <div className="okr-cateogry">
                <label className="okr-cateogry__label">Category</label>
                <select value={category} onChange={handleCategoryChange}>
                    {OKR_CATEGORY_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
            </div>
            <ErrorBoundary>
                {
                    Object.keys(state.okrData).length > 0 ?
                        <section className="ally-okr">
                            {
                                Object.keys(state.okrData)
                                    .map((parentId, index) => <OkrSegment key={parentId} count={index + 1} title={state.okrData[parentId].title} nestChildren={state.okrData[parentId].children} />)
                            }
                        </section> : <NoData />
                }
            </ErrorBoundary>
        </>
    )
}

