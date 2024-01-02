import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
    const navigate = useNavigate();

    useEffect(() => {
        if (!loginInfo || !loginInfo.accessToken) {
            navigate('/LoginForm');
        } else {
            const fetchData = async () => {
                try {
                    const response = await axios.get('/members/getMemberList', {
                        headers: {
                            Authorization: `Bearer ${loginInfo.accessToken}`,
                        },
                    });
                    setUsers(response.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        }
    }, []);

    const handleDelete = async (memberId) => {
        try {
            // memberId를 사용하여 해당 회원 삭제 API 호출
            await axios.delete(`/members/${memberId}`, {
                headers: {
                    Authorization: `Bearer ${loginInfo.accessToken}`,
                },
                data: {refreshToken: loginInfo.refreshToken},
            });

            // 삭제 후 목록 갱신
            const updatedUsers = users.filter((user) => user.memberId !== memberId);
            setUsers(updatedUsers);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleGoToMyPage = () => {
        // Navigate to MyPage
        navigate('/MyPage');
    };


    const columns = [
        { field: 'memberId', headerName: 'ID', width: 70 },
        { field: 'name', headerName: '이름', width: 130 },
        { field: 'email', headerName: '이메일', width: 200 },
        { field: 'regdate', headerName: '가입일', width: 150 },
        { field: 'gender', headerName: '성별', width: 100 },
        {
            field: 'roles',
            headerName: '역할',
            width: 150,
            renderCell: (params) => (
                <div>
                    {params.value.map((role) => (
                        <div key={role.roleId}>{role.name}</div>
                    ))}
                </div>
            ),
        },
        {
            field: 'action',
            headerName: '삭제',
            width: 100,
            renderCell: (params) => (
                <button onClick={() => handleDelete(params.row.memberId)}>삭제</button>
            ),
        },
    ];

    return (
        <div style={{height: 400, width: '100%'}}>
            <h1>회원 목록</h1>
            <button style={{marginBottom:"15px"}} onClick={handleGoToMyPage}>MyPage로 이동</button>
            <DataGrid rows={users} columns={columns} pageSize={5} getRowId={(row) => row.memberId}/>
        </div>
    );
};

export default AdminPage;