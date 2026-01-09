package com.example.demo.repository;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface MainRepository {

    List<Map<String, Object>> getVocDic();
}
