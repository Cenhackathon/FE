import React from 'react';

function ComplaintForm({ onSubmit }) {
    return (
        <form className="complaint-form" onSubmit={onSubmit}>
            {/* 민원 신청 폼 내용 */}
            <div className="form-placeholder">민원 신청 폼</div>
        </form>
    );
}

export default ComplaintForm;
