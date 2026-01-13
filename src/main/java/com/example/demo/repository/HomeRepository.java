package com.example.demo.repository;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface HomeRepository {

    Map<String, Object> getLastRegDate();
    Map<String, Object> getSecondLastRegDate();
    Map<String, Object> getThirdLastRegDate();
    List<Map<String, Object>> select(Map<String, Object> data);
}
