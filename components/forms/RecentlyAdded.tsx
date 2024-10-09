"use client"

import { useEffect, useState } from 'react';
import { getRecentlyAdded50Quizes } from '@/lib/actions/quiz.actions';
import { IQuizMetadata } from '@/lib/models/quiz_metadata.model';
import Quiz from '../cards/Quiz';

export default function RecentlyAdded() {
    const [quizzes, setQuizzes] = useState<IQuizMetadata[]>([]);

    useEffect(() => {

        const fetchQuizzes = async () => {
            try {
                const fetchedQuizzes: IQuizMetadata[] | []= await getRecentlyAdded50Quizes();
                setQuizzes(fetchedQuizzes);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };

        fetchQuizzes();
    }, []);

    return (
        <div className="overflow-y-scroll max-h-80 w-full" style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 #27272A'}}>
            <ul className="flex flex-wrap gap-4 items-center justify-center">
                {quizzes.map((quiz) => (
                    <Quiz key={quiz.id} quiz={quiz}/>
                ))}
            </ul>
        </div>
    );
}
