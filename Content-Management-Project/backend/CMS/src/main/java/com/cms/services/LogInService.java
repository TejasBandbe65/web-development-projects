package com.cms.services;

import com.cms.models.User;

public interface LogInService {

	public User validateEmail(String email);
	
	public long findIdByEmail(String email);
}
