const express = require('express');
const router = express.Router();
const Question = require('../models/question_model');
const Answer = require('../models/answer_model');
const User = require('../models/user');



router.get('/questions', async (req, res) => {
  const filter = req.query.filter || 'recentlyAsked';  

  let questions;
  let query = {};

  
  if (filter === 'answered') {
    query = { answered: true };  
  } else if (filter === 'unanswered') {
    query = { answered: false };  
  } else if (filter === 'mostLiked') {
    
    questions = await Question.find().sort({ like: -1 }).limit(10).populate('creator');
    return res.render('faq', { 
      questions, 
      user: req.user, 
      filter 
    });
  } else if (filter === 'recentlyAsked') {
    
    questions = await Question.find().sort({ createdAt: -1 }).limit(10).populate('creator');
    return res.render('faq', { 
      questions, 
      user: req.user, 
      filter 
    });
  }

  
  questions = await Question.find(query).populate('creator');

  
  res.render('faq', { 
    questions, 
    user: req.user, 
    filter 
  });
});


router.get('/', async (req, res) => {
  const filter = req.query.filter || 'recentlyAsked';  

  let questions;
  let query = {};

  
  if (filter === 'unanswered') {
    query = { answered: false };  
  } else if (filter === 'mostLiked') {
    
    questions = await Question.find().sort({ like: -1 }).limit(10).populate('creator');
    return res.render('faq', { 
      filter, 
      
      questions ,
      user: req.user ? req.user : null, 
    });
  } else if (filter === 'recentlyAsked') {
    
    questions = await Question.find().sort({ createdAt: -1 }).limit(10).populate('creator');
    // console.log(questions);
    return res.render('faq', { 
      filter, 
      questions, 
      user: req.user ? req.user : null, 
    });
  } else if (filter === 'answered') {
    query = { answered: true };  
  }

  
  questions = await Question.find(query).populate('creator');
  // console.log(questions) ;

  
  res.render('faq', { 
    filter, 
    unansweredQuestions: filter === 'unanswered' ? questions : undefined, 
    mostLikedQuestions: filter === 'mostLiked' ? questions : undefined, 
    recentlyAskedQuestions: filter === 'recentlyAsked' ? questions : undefined,
    user: req.user ? req.user : null, 
    questions  
  });
});



router.get('/answer/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('creator');
    res.render('answer', { question, user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


router.post('/answer/:id', async (req, res) => {
  const { answerText } = req.body;
  const questionId = req.params.id;
  
  try {
    
    const answer = new Answer({
      question: questionId,
      user: req.user.id,
      answerText
    });
    await answer.save();

    
    await Question.findByIdAndUpdate(questionId, { answered: true });
    await Question.findByIdAndUpdate(questionId, { $inc: { answerCount: 1 } });

    res.redirect('/faq');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving answer');
  }
});



router.get('/view/:id', async (req, res) => {
  const questionId = req.params.id;
  const question = await Question.findById(questionId);
  const answers = await Answer.find({ question: questionId }).populate('user');
  
  
  
  res.render('view', { question, answers, user: req.user });
});

router.post('/delete-answer/:id', async (req, res) => {
  const answerId = req.params.id;
  
  
  try {
    const answer = await Answer.findById(answerId);
    
    
    if (!answer) {
      return res.status(404).send("Answer not found");
    }

    if (!req.user) {
      return res.status(401).send("User not authenticated");
    }

    
    if (JSON.stringify(req.user.id) === JSON.stringify(answer.user)) {
      await Answer.findByIdAndDelete(answerId);
      return res.redirect('back');
    } else {
      return res.status(403).send("Unauthorized to delete this answer");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});


router.get('/edit-answer/:id', async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    const question = await Question.findById(answer.question);
    
    
    if (!answer || !(JSON.stringify(req.user.id) === JSON.stringify(answer.user))){
      return res.redirect('back');
    }
    
    res.render('edit', { answer, question , user:req.user});
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});


router.post('/edit-answer/:id', async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    console.log(answer);
    if ((JSON.stringify(req.user.id) === JSON.stringify(answer.user))) {
      answer.answerText = req.body.answerText;
      await answer.save();
      res.redirect(`/faq/view/${answer.question}`);
    } else {
      res.redirect('back');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});




router.get('/edit-question/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question || !(JSON.stringify(req.user.id) === JSON.stringify(question.creator))) {
      return res.redirect('back');  
    }
    
    res.render('edit_question', { question , user:req.user});
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});


router.post('/edit-question/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (JSON.stringify(req.user.id) === JSON.stringify(question.creator)) {
      question.title = req.body.title;
      question.question = req.body.questionText;
      await question.save();
      res.redirect(`/faq/view/${question._id}`);  
    } else {
      res.redirect('back');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});



router.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json([]);  

  try {
    const results = await Question.find({
      title: { $regex: query, $options: 'i' }  
    }).select('title _id');  

    res.json(results);
  } catch (error) {
    console.error("Error fetching search results:", error);
    res.status(500).json([]);
  }
});


router.post('/like/:id', async (req, res) => {
  const questionId = req.params.id;
  const { like } = req.body;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    if (like) {
      question.like += 1;
    } else {
      question.like = Math.max(0, question.like - 1); 
    }

    await question.save();
    res.json({ success: true, likeCount: question.like });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating like count' });
  }
});

router.get('/delete-question/:id', async (req, res)=>{
  await Question.findByIdAndDelete(req.params.id) ;
  res.redirect(/faq/);
});


module.exports = router;
