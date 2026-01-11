package com.example.demo.repository;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface ManageRepository {

    int createVocEng(Map<String, Object> data);
    int createVocMon(Map<String, Object> data);
    int createVocDic(Map<String, Object> data);
    int updateVocEng(Map<String, Object> data);
    int updateVocMon(Map<String, Object> data);
    int deleteVocDic(Map<String, Object> data);
    int deleteVocEng(Map<String, Object> data);
    int deleteVocMon(Map<String, Object> data);
    List<Map<String, Object>> selectVocDic();
}
