const users={
  standard: { username: 'standard_user', password: 'secret_sauce' },
  locked: { username: 'locked_out_user', password: 'secret_sauce' },
  problem: { username: 'problem_user', password: 'secret_sauce' },
  glitch: { username: 'performance_glitch_user', password: 'secret_sauce' },
  error: { username: 'error_user', password: 'secret_sauce' },
  visual: { username: 'visual_user', password: 'secret_sauce' },
  invalid: { username: 'invalid_user', password: 'wrong_password' },
  badUser: { username: 'wrong_user', password: 'secret_sauce' },
  badPass: { username: 'standard_user', password: 'wrong_password' }
};

module.exports={ users };
