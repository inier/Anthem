/*
 * @Author: your name
 * @Date: 2020-04-18 14:01:26
 * @LastEditTime: 2020-04-19 20:25:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Anthem\app\components\titile\index.js
 */
import React from 'react';
import BaseCom from '@/app/components/BaseComponent';
import styled from 'styled-components';

const TitleContainer = styled.div `
    width: 100%;
    position: relative;
    background: #ffffff;
    display: block;
    clear:both;
    &>.title_content{
        display: block;
        width: 100%;
        padding: .6rem;
        box-sizing: border-box;
        .AnthemName{
            font-weight: bold;
            font-size: 1.3rem;
            padding-left:0.2rem;
        }
        .item{
            display: inline-block;
            padding: 0.2rem;
            text-index:0.5rem;
            font-size: 12px;
        }
    }
`;

class Title extends BaseCom {
    render() {
        return (
            <TitleContainer>
                <ul className='title_content'>
                    <li className='AnthemName'>Anthem</li>
                    <li className='item'>redux</li>
                    <li className='item'>react-redux</li>
                    <li className='item'>immutable</li>
                    <li className='item'>styled-components</li>
                </ul>
            </TitleContainer>
        );
    }
}

export default Title;