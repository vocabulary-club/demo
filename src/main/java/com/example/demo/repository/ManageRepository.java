package com.example.demo.repository;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface ManageRepository {

    int saveVocEng(Map<String, Object> data);
    int saveVocMon(Map<String, Object> data);
    int saveVocDic(Map<String, Object> data);
}
