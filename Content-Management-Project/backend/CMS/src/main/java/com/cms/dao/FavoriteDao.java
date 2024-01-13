package com.cms.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.models.Favourite;
import com.cms.models.Blog;
import java.util.List;
import java.util.Optional;

public interface FavoriteDao extends JpaRepository<Favourite, Long> {

	
}
